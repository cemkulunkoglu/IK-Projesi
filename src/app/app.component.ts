import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as trLang } from './modules/i18n/vocabs/tr';
import { loadMessages, locale } from 'devextreme/localization';
import trMessages from 'devextreme/localization/messages/tr.json';


@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService,
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      trLang,
    );
  }

  ngOnInit() {
    locale("tr");
    loadMessages(trMessages);
  }
}
