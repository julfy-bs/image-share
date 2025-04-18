import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: User | User[]) => {
        if (Array.isArray(data)) {
          for (const user of data) {
            delete user.password;
          }
        } else {
          delete data.password;
        }

        return data;
      }),
    );
  }
}
