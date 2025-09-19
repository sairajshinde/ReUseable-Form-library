import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CommonService } from './shared/common.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const common = inject(CommonService);
  const auth = common.gettoken();

  if (req.url.includes('/login')) {
    return next(req);
  }

   const tokenData = common.gettoken(); 

  if (tokenData?.value && tokenData?.keyvalue) { 
    const cloned = req.clone({
      setHeaders: {
          ...(tokenData?.value && { Authorization: tokenData.value }),
          ...(tokenData?.keyvalue && { Authorizationkey: tokenData.keyvalue }),
      },
      withCredentials: true
    });
    return next(cloned);
  }
  return next(req);
};
