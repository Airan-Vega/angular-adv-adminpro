import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivationEnd, Data, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  public titulo: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router) {
    this.getArgumentosRuta()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        // Etiqueta html <title> proveniente del index.html
        document.title = `AdminPro - ${titulo}`;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
    document.title = `AdminPro`;
  }

  getArgumentosRuta(): Observable<Data> {
    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }
}
