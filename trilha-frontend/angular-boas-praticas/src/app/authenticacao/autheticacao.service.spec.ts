import { TestBed } from '@angular/core/testing';

import { AutheticacaoService } from './autheticacao.service';

describe('AutheticacaoService', () => {
  let service: AutheticacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutheticacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
