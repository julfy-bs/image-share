import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Response<T> {
  data: T;
}

@Injectable()
export class WishInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return;
        }

        if (Array.isArray(data)) {
          data.map((item) => {
            delete item.owner.password;
            delete item.owner.email;
          });
        } else {
          data.owner ? delete data.owner.password : null;
          data.owner ? delete data.owner.email : null;
        }

        return data;
      }),
    );
  }
}
