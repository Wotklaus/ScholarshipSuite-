import { UserLoggedDto } from '../dto/user-logged.dto';

export class UserLoggedHandler {
  handle(event: UserLoggedDto) {
    console.log('📩 [NOTIFICATION] User logged in:', event.userId);
  }
}
