import { TestBed } from '@angular/core/testing';

import { MunicipalityProviderService } from './municipality-provider.service';

describe('MunicipalityProviderService', () => {
  let service: MunicipalityProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MunicipalityProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});