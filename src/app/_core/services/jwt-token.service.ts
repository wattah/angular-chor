import { TokenVO } from './../models/TokenVO';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  public decodeToken(token: TokenVO) {
    console.log('token', token);
    const decodedToken = jwt_decode(token.token);
    return {
      userId: token.userId,
      value: decodedToken,
      userFirstName: token.userFirstName,
      userLastName: token.userLastName,
      roles: token.userRoles,
    };
  }
}
