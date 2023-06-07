import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TenantAgentListComponent } from './tenant-agent-list.component';

describe('TenantAgentListComponent', () => {
  let component: TenantAgentListComponent;
  let fixture: ComponentFixture<TenantAgentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantAgentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
