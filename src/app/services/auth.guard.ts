import { CanActivateFn, Router} from '@angular/router';
import { CommonService } from './shared/common.service';
import { inject} from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const common = inject(CommonService);
  const router = inject(Router);
  if (common.isProcessorRole()){
    return true;
  } else {
    router.navigate(['error/1']);
    return false;
  }
  
};
