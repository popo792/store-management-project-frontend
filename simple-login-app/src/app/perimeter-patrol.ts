import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PerimeterPatrol implements CanActivate {
  
  constructor(private navigatorNode: Router) {}

  canActivate(pathData: ActivatedRouteSnapshot): boolean {
    const securityHash = localStorage.getItem('token');
    
    if (!securityHash) {
      this.navigatorNode.navigate(['/login']);
      return false;
    }

    try {
      const payloadString = atob(securityHash.split('.')[1]);
      const embeddedDetails = JSON.parse(payloadString);
      const clearanceRequired = pathData.data['clearanceLevel'];

      if (embeddedDetails.rank === clearanceRequired) {
        return true;
      }
      
      this.navigatorNode.navigate(['/login']);
      return false;
      
    } catch (fault) {
      this.navigatorNode.navigate(['/login']);
      return false;
    }
  }
}