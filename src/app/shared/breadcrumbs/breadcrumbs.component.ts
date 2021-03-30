import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivationEnd, Data, Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  public titulo: string;
  public tituloSubs$: Subscription;

  constructor(private router: Router) {
    this.tituloSubs$ = this.getArgumentosRuta().subscribe(({ titulo }) => {
      this.titulo = titulo;
      // Etiqueta html <title> proveniente del index.html
      document.title = `AdminPro - ${titulo}`;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
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
