import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Project, User } from '../models';
import { GatewayApi } from './gateway.api';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GatewayApi<User> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('users', http, auth, uxService);
  }

  calculateLevel(user: User) {
    const velocity = user.points.velocity;

    let level = 3; // average

    if (velocity > 25) {
      if (velocity > 35) {
        level = 5;
      } else {
        level = 4;
      }
    } else if (velocity < 17) {
      if (velocity < 10) {
        level = 1;
      } else {
        level = 2;
      }
    }

    return level;
  }

  addSudoPoints(users: User[], project?: Project) {

    const asiSupportPoints = 10;
    const eduSupportPoints = 17;
    const aquaSupportPoints = 5;
    const managementPercentage = 20;

    const sunnyId = 4;
    const gurpreetId = 10;
    const manojId = 263;
    const ravikantId = 298;
    const saurabhId = 313;

    const gurpinderId = 351;
    const ahbimanuId = 339;
    const amitId = 346;
    const vikramId = 343;
    const pradeepId = 174;

    const managerId1 = manojId;
    const manager2Id = saurabhId;
    const manager3Id = ravikantId;

    const members1 = [gurpinderId, ahbimanuId];
    const members2 = [vikramId, pradeepId];
    const members3 = [amitId];

    const asiSupportId = manojId;
    const eduSupportId = pradeepId;
    const aquaSupportId = manojId;

    const asiProjectId = 299;
    const eduProjectId = 2;
    const aquaProjectId = 309;

    let manager1: User;
    const team1: User[] = [];

    let manager2: User;
    const team2: User[] = [];

    let manager3: User;
    const team3: User[] = [];

    const managers: User[] = [];
    const support: User[] = [];

    users.forEach((item) => {

      if (item.points.velocity) {
        item.points.days = Math.ceil(7 * item.points.backlog / item.points.velocity);
      }

      item.points.support = 0;
      item.points.management = 0;

      switch (item.id) {
        case managerId1:
          manager1 = item;
          managers.push(item);
          break;

        case manager2Id:
          manager2 = item;
          managers.push(item);
          break;

        case manager3Id:
          manager3 = item;
          managers.push(item);
          break;
      }

      if (members1.find((i) => i === item.id)) {
        team1.push(item);
      }

      if (members2.find((i) => i === item.id)) {
        team2.push(item);
      }

      if (members3.find((i) => i === item.id)) {
        team3.push(item);
      }
    });

    users.forEach((item) => {
      if (item.id === managerId1 || item.id === manager2Id || item.id === manager3Id) {
        managers.push(item);
      }
    });

    if (project) {
      users.forEach((item) => {
        switch (project.id) {
          case asiProjectId:
            if (item.id === asiSupportId) {
              item.points.support += asiSupportPoints;
              support.push(item);
            }
            break;

          case eduProjectId:
            if (item.id === eduSupportId) {
              item.points.support += eduSupportPoints;
              support.push(item);
            }
            break;
          case aquaProjectId:
            if (item.id === aquaSupportId) {
              item.points.support += aquaSupportPoints;
              support.push(item);
            }
            break;
        }
      });
    } else {
      users.forEach((item) => {
        if (item.id === eduSupportId) {
          item.points.support += eduSupportPoints;
          support.push(item);
        }

        if (item.id === asiSupportId) {
          item.points.support += asiSupportPoints;

          support.push(item);
        }

        if (item.id === aquaSupportId) {
          item.points.support += aquaSupportPoints;
          support.push(item);
        }
      });
    }

    support.forEach((item) => {
      item.points.velocity += item.points.support;
    });

    if (manager1) {
      team1.forEach((m) => {
        manager1.points.management += m.points.velocity;
      });
      manager1.points.management = Math.ceil(managementPercentage * manager1.points.management / 100);
      manager1.points.velocity += manager1.points.management;
    }

    if (manager2) {
      team2.forEach((m) => {
        manager2.points.management += m.points.velocity;
      });

      manager2.points.management = Math.ceil(managementPercentage * manager2.points.management / 100);
      manager2.points.velocity += manager2.points.management;
    }

    if (manager3) {
      team3.forEach((m) => {
        manager3.points.management += m.points.velocity;
      });

      manager3.points.management = Math.ceil(managementPercentage * manager3.points.management / 100);
      manager3.points.velocity += manager3.points.management;
    }
  }
}
