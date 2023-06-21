import {FormControl, ValidationErrors} from "@angular/forms";

export class BlazeValidators {
  //whitespace validation
  static notOnlyWhitespace(control:FormControl):ValidationErrors{
    //check if the string only has white space
    if ((control.value != null) && (control.value.trim().length===0)){
      //invalid return error object
      return {'notOnlyWhitespace' : true};
    }else {
      //valid
      return null;
    }
  }
}
