import { Module } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { GramService } from './gram.service';

@Module({
  providers: [
    // {
    //   provide: Telegraf,
    //   useFactory: () => {
    //     const botToken = 'YOUR_BOT_TOKEN';
    //     return new Telegraf(botToken);
    //   },
    // },
    GramService,
  ],
  exports: [GramService],
})
export class GramModule {}