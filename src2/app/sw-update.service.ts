import { ApplicationRef, Inject, Injectable, OnDestroy } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { BehaviorSubject, concat, interval, NEVER, Observable, Subject } from "rxjs";
import { first, map, take, takeUntil, tap } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import { openDialog } from "./modal-question/function/open-dialog.function";
import { MatDialog } from "@angular/material";

/**
 * copy from: https://github.com/angular/angular/blob/master/aio/src/app/sw-updates/sw-updates.service.ts
 * SwUpdatesService
 *
 * @description
 * 1. Checks for available ServiceWorker updates once instantiated.
 * 2. Re-checks every 6 hours.
 * 3. Whenever an update is available, it activates the update.
 *
 */
@Injectable()
export class SwUpdatesService implements OnDestroy {
  private checkInterval = 1000 * 60 * 60 * 6; // 6 hours
  private onDestroy = new Subject<void>();
  updateActivated: Observable<string>;

  // *
  readonly hasNewVersion$ = new BehaviorSubject<boolean>(undefined);

  constructor(appRef: ApplicationRef, readonly swu: SwUpdate, @Inject(DOCUMENT) private document: Document, private matDialog: MatDialog) {
    console.log('SW is enabled: ', swu.isEnabled);

    if (!swu.isEnabled) {
      this.updateActivated = NEVER.pipe(takeUntil(this.onDestroy));
      // *
      this.hasNewVersion$.next(false);
      return;
    }

    // *
    // elso check update status bevarasa
    const statusSubscription = this.swu['sw']
      ['eventsOfType']('STATUS')
      .pipe(take(1))
      .subscribe(status => {
        if (this.hasNewVersion$.getValue() === undefined) {
          this.hasNewVersion$.next(false);
          console.warn('sw status: ', status);
        }
      });

    // Periodically check for updates (after the app is stabilized).
    const appIsStable = appRef.isStable.pipe(first(v => v));
    concat(appIsStable, interval(this.checkInterval))
      .pipe(
        tap(() => this.log('Checking for update...')),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => this.swu.checkForUpdate());

    // Activate available updates.
    this.swu.available
      .pipe(
        tap(evt => this.log(`Update available: ${JSON.stringify(evt)}`)),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => {
        // *
        if (!statusSubscription.closed) {
          statusSubscription.unsubscribe();
        }
        this.hasNewVersion$.next(true);
        this.swu.activateUpdate().then(() => {
          openDialog(this.matDialog, { title: 'Update', text: 'Has a new version!', okButtonText: 'OK' })
            .afterClosed()
            .subscribe(() => this.document.location.reload());
        });
      });

    // Notify about activated updates.
    this.updateActivated = this.swu.activated.pipe(
      tap(evt => this.log(`Update activated: ${JSON.stringify(evt)}`)),
      map(evt => evt.current.hash),
      takeUntil(this.onDestroy)
    );
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[SwUpdates - ${timestamp}]: ${message}`);
  }
}
