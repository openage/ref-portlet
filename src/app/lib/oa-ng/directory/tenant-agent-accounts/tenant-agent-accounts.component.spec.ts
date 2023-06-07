import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TenantAgentAccountsComponent } from './tenant-agent-accounts.component';

describe('TenantAgentAccountsComponent', () => {
  let component: TenantAgentAccountsComponent;
  let fixture: ComponentFixture<TenantAgentAccountsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantAgentAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantAgentAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
