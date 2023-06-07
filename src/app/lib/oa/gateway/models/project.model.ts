import { Entity, ModelBase, Pic } from '../../core/models';
import { Category } from './category.model';
import { Member } from './member.model';
import { ProjectType } from './project-type.model';
import { Release } from './release.model';
import { Sprint } from './sprint.model';
import { TimeLine } from './timeline.model';

export class Project extends ModelBase {
  description: string;
  type: ProjectType;

  entity: Entity;
  image: Pic;

  velocity: number;
  points: number;
  burnt: number;

  plan: TimeLine;
  actual: TimeLine;

  color: string;

  children: Project[];
  parent: Project;
  watched: boolean;

  categories: Category[];

  members: Member[];
  sprints: Sprint[];
  releases: Release[];

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.description = obj.description;

    if (obj.image) { this.image = new Pic(obj.image); }
    if (obj.entity) { this.entity = new Entity(obj.entity); }

    this.velocity = obj.velocity;
    this.points = obj.points;
    this.burnt = obj.burnt;

    if (obj.type) {
      this.type = new ProjectType(obj.type);
    }

    this.plan = new TimeLine(obj.plan);
    this.actual = new TimeLine(obj.actual);

    this.color = obj.color;
    this.watched = obj.watched;

    this.children = obj.children ? obj.children.map((i) => new Project(i)) : [];
    if (obj.parent) { this.parent = new Project(obj.parent); }

    this.categories = obj.categories ? obj.categories.map((i) => new Category(i)) : [];
    this.members = obj.members ? obj.members.map((i) => new Member(i)) : [];
    this.sprints = obj.sprints ? obj.sprints.map((i) => new Sprint(i)) : [];
    this.releases = obj.releases ? obj.releases.map((i) => new Release(i)) : [];
  }
}
