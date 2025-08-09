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
import { SingleSlashInputDirective } from './style/single-slash-input.directive';
import { NumberDirective } from './type/number.directive';
import { PrimaryButtonDirective } from './buttons/primary-button.directive';
import { MenuBarDirective } from './Menu-Bar/menu-bar.directive';
import { CustomTableDirective } from './table/custom-table.directive';
import { DualInputFieldDirective } from './style/dual-input-field.directive';
import { MobileDirective } from './style/mobile.directive';
import { FloatNumberDirective } from './type/floatNumber.directive';
import { SpinnerDirective } from './style/spinner.directive';
import { ConfirmDialogueDirective } from './style/confirm-dialog.directive';


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
    LibLabelTextDirective,
    SingleSlashInputDirective,
    NumberDirective,
    PrimaryButtonDirective,
    MenuBarDirective,
    CustomTableDirective,
    DualInputFieldDirective,
    MobileDirective,
    FloatNumberDirective,
    SpinnerDirective,
    ConfirmDialogueDirective
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
    LibLabelTextDirective,
    SingleSlashInputDirective,
    NumberDirective,
    PrimaryButtonDirective,
    MenuBarDirective,
    CustomTableDirective,
    DualInputFieldDirective,
    MobileDirective,
    FloatNumberDirective,
    SpinnerDirective,
    ConfirmDialogueDirective
  ]
})
export class UiDirectivesModule {}
 