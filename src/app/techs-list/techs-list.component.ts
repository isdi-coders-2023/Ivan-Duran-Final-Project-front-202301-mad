import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  TechsList,
  Tech,
  Technique,
  TechPages,
  techsListed,
} from 'src/types/tech';
import { TechsService } from '../services/techs.service';

@Component({
  selector: 'app-techs-list',
  templateUrl: './techs-list.component.html',
  styleUrls: ['./techs-list.component.scss'],
})
export class TechsListComponent implements OnInit {
  techs: TechsList;
  techPages: TechPages;
  techsToSearch: Technique[];

  constructor(private techsService: TechsService) {
    this.techs = {} as TechsList;
    this.techPages = {} as TechPages;
    this.techsToSearch = techsListed;
  }

  ngOnInit(): void {
    this.initializeTechPages();
    this.loadTechs();
    this.subscribeToTechsUpdates();
  }

  private initializeTechPages(): void {
    this.techsToSearch.forEach((tech) => {
      this.techPages[tech] = { page: 1, exists: false };
    });
  }

  private loadTechs(): void {
    const observables: Observable<TechsList>[] = this.techsToSearch.map(
      (tech) => {
        return this.techsService.getTechsCategorized('1', tech).pipe(first());
      }
    );

    forkJoin(observables).subscribe();
  }

  private subscribeToTechsUpdates(): void {
    this.techsService.techs$.subscribe((data) => {
      this.techs = data;
      Object.entries(this.techs).forEach((item) => {
        this.checkExistence(item[1].techs, item[0] as Technique);
      });
    });
  }

  private checkExistence(obj: Tech[], tech: Technique): void {
    if (obj.length === 0) return;
    this.techPages[tech].exists = true;
  }

  handleNext(pTech: Technique): void {
    const maxPage = Math.ceil(this.techsService.techs$.value[pTech].number / 3);
    if (this.techPages[pTech].page >= maxPage) {
      return;
    }
    this.techPages[pTech].page++;
    this.loadTechsForPage(pTech, this.techPages[pTech].page);
  }

  handlePrev(pTech: Technique): void {
    if (this.techPages[pTech].page <= 1) return;

    this.techPages[pTech].page--;
    this.loadTechsForPage(pTech, this.techPages[pTech].page);
  }

  private loadTechsForPage(pTech: Technique, page: number): void {
    this.techsService
      .getTechsCategorized(String(page), pTech)
      .pipe(first())
      .subscribe((data) => {
        this.techs = { ...this.techs, ...data };
      });
  }
}
