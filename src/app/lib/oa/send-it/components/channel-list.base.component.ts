import { ErrorHandler, Input, OnInit } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Channel, Provider } from '../models';
import { ChannelService } from '../services';
import { ProviderService } from '../services/provider.service';

export class ChannelListBaseComponent extends PagerModel<Channel> implements OnInit {

  @Input()
  category: string;

  providers: Provider[] = [];

  newChannel: Channel;

  constructor(
    private providerService: ProviderService,
    private api: ChannelService,

    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler, filters: ['category'] });
  }
  ngOnInit(): void {
    this.filters.properties['category'].value = this.category;
    this.fetch();
  }

  toggleStatus(item: Channel) {
    item.status = item.status === 'disabled' ? 'enabled' : 'disabled';
    this.update(item).subscribe(() => {
      this.fetch();
    });
  }

  save() {
    this.create(this.newChannel).subscribe(() => {
      this.newChannel = null;
    });
  }

  addChannel() {
    this.newChannel = new Channel();
    this.providers = [];
    this.providerService.search({ category: this.category }).subscribe((page) => {

      page.items.forEach((item) => {
        if (!this.items.find((i) => i.provider.id === item.id)) {
          this.providers.push(item);
        }
      });
    });
  }
}
