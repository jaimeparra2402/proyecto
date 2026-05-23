import { Injectable } from '@angular/core';
import { BackendToggleService } from './backend-toggle.service';
import { NodePlayerService } from './node-player.service';
import { JavaPlayerService } from './java-player.service';
import { PlayerStrategy } from './player.strategy';

@Injectable({
  providedIn: 'root'
})
export class PlayerFactoryService {
  constructor(
    private toggleService: BackendToggleService,
    private nodeService: NodePlayerService,
    private javaService: JavaPlayerService
  ) {}

  getStrategy(): PlayerStrategy {
    const activeBackend = this.toggleService.getBackend();
    if (activeBackend === 'JAVA') {
      return this.javaService;
    }
    return this.nodeService;
  }
}