import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Address, Asset, Decision, Institution, Solution, Stage } from '@app/core';
import { AssetProperty } from '../../../core/store/actions/asset-properties.action';

import * as fromStore from '@app/core/store';
import { select, Store } from '@ngrx/store';

import { combineLatest, Observable } from 'rxjs';

export enum AssetProperties {
  SOLUTIE = 'solutie',
  INCULPAT = 'inculpat',
  ADRESA = 'adresa',
}

@Component({
  templateUrl: 'asset-detail.component.html',
  styleUrls: ['asset-detail.component.scss'],
})

export class AssetDetailComponent implements OnInit {
  private asset$: Observable<Asset>;
  private institutions$: Observable<Institution[]>;
  private decisions$: Observable<Decision[]>;
  private stages$: Observable<Stage[]>;
  private assetProperty$: Observable<fromStore.AssetProperty>;

  properties = [
    { name: 'Solutie', value: AssetProperties.SOLUTIE },
    { name: 'Inculpat', value: AssetProperties.INCULPAT },
    { name: 'Adresa', value: AssetProperties.ADRESA },
  ];
  selectedProperty: string;

  constructor(
    private store: Store<fromStore.CoreState>,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((aParams: any) => {
      const theId = aParams.assetId;

      this.asset$ = this.store.pipe(select(fromStore.getAssetById(theId)));
      this.assetProperty$ = this.store.pipe(select(fromStore.getAssetPropertiesByAssetId(theId)));
      this.institutions$ = this.store.pipe(select(fromStore.getAllInstitutions));
      this.decisions$ = this.store.pipe(select(fromStore.getAllDecisions));
      this.stages$ = this.store.pipe(select(fromStore.getAllStages));
    });
  }

  isEditing$(): Observable<boolean> {
    return combineLatest(
        this.asset$,
        this.assetProperty$,
        (aAsset, aAssetProperty) => aAsset !== undefined && aAssetProperty !== undefined
      );
  }

  addProperty() {
    switch (this.selectedProperty) {
      case AssetProperties.SOLUTIE: {
        this.asset$.subscribe((aAsset: Asset) => {
          const theSolution = new Solution();
          theSolution.setAsset(aAsset);
          this.store.dispatch(new fromStore.UpdateProperty(theSolution));
        });
        break;
      }
      case AssetProperties.ADRESA: {
        this.asset$.subscribe((aAsset: Asset) => {
          const theAddress = new Address();
          theAddress.setAsset(aAsset);
          this.store.dispatch(new fromStore.UpdateProperty(theAddress));
        })
        break;
      }
    }

    this.resetSelectedProperty();
  }

  onPropertyUpdate(aProperty: AssetProperty) {
    this.store.dispatch(new fromStore.UpdateProperty(aProperty));
  }

  onPropertyCancel(aProperty: AssetProperty) {
    this.store.dispatch(new fromStore.DeleteProperty(aProperty.getAsset().id));
  }

  onPropertySave(aProperty: AssetProperty) {
    if (this.isSolution(aProperty)) {
      this.store.dispatch(new fromStore.CreateSolution(aProperty as Solution));
    } else if (this.isAddress(aProperty)) {
      // TODO: this.store.dispatch(new fromStore.CreateAddress(aProperty as Address));
    }
  }

  isSolution(aProperty: AssetProperty) {
    return aProperty instanceof Solution;
  }

  isAddress(aProperty: AssetProperty) {
    return aProperty instanceof Address;
  }

  private resetSelectedProperty() {
    this.selectedProperty = undefined;
  }
}
