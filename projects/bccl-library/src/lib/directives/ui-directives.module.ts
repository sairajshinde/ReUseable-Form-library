import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ✅ Import all standalone directives
import { TextDirective } from './type/text.directive';
import { TextareaDirective } from './type/textarea.directive';
import { SelectDirective } from './type/select.directive';
import { FileuploadDirective } from './type/fileupload.directive';
import { EmailDirective } from './type/email.directive';
import { DateDirective } from './type/date.directive';
import { CheckboxDirective } from './type/checkbox.directive';
import { MultiSelectDirective } from './type/multi-select.directive';
import { MultiFileUploadDirective } from './type/multi-file-upload.directive';
import { UiUnderlineDirective } from './style/ui-underline.directive';
import { UiBoxDirective } from './style/ui-box.directive';
import { TelDirective } from './type/tel.directive';
import { RequiredDirective } from './validation/required.directive';
import { LibPlaceholderTitleDirective } from './style/place-holder-title.directive';
import { DynamicRowDirective } from './style/dynamic-row.directive';
import { LibLabelTextDirective } from './style/label-text.directive';

@NgModule({
  imports: [
    CommonModule,
    RequiredDirective,
    TelDirective,
    TextDirective,
    TextareaDirective,
    SelectDirective,
    FileuploadDirective,
    EmailDirective,
    DateDirective,
    CheckboxDirective,
    MultiSelectDirective,
    MultiFileUploadDirective,
    UiUnderlineDirective,
    UiBoxDirective,
    LibPlaceholderTitleDirective,
    DynamicRowDirective,
    LibLabelTextDirective
  ],
  exports: [
    TextDirective,
    RequiredDirective,
    TelDirective,
    TextareaDirective,
    SelectDirective,
    FileuploadDirective,
    EmailDirective,
    DateDirective,
    CheckboxDirective,
    MultiSelectDirective,
    MultiFileUploadDirective,
    UiUnderlineDirective,
    UiBoxDirective,
    LibPlaceholderTitleDirective,
    DynamicRowDirective,
    LibLabelTextDirective
  ]
})
export class UiDirectivesModule {}
