import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  const addMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    addMock.mockClear();
    TestBed.configureTestingModule({
      providers: [{ provide: CounterService, useValue: { add: addMock } }],
    });
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('forwards saved counters to the counter service', async () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
      createdAt: '2026-09-17T09:00:00.000Z',
    };

    await component.onSaved(first);
    await component.onSaved(second);

    expect(addMock).toHaveBeenNthCalledWith(1, first);
    expect(addMock).toHaveBeenNthCalledWith(2, second);
  });
});