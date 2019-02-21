import { World, System, EntityId, TEntityId, Read, Write, SystemContext, Query } from "hecs";

const world = new World();

class Position {
  x: number;

  constructor(x: number) {
    this.x = x;
  }
}

class Velocity {
  v: number;

  constructor(v: number) {
    this.v = v;
  }
}

world.registerComponent(Position);
world.registerComponent(Velocity);

interface VelocitySystemContext extends SystemContext {
  entities: Query<[Position, Velocity]>
}

class VelocitySystem extends System<VelocitySystemContext> {
  setup() {
    return {
      entities: this.world.createQuery(Write(Position), Read(Velocity))
    };
  }

  update() {
    for (const [position, velocity] of this.ctx.entities) {
      position.x += velocity.v;
    }
  }
}

interface LoggingSystemContext extends SystemContext {
  entities: Query<[TEntityId, Position]>
}

class LoggingSystem extends System<LoggingSystemContext> {
  setup() {
    return {
      entities: this.world.createQuery(EntityId, Read(Position))
    };
  }

  update() {
    for (const [entityId, position] of this.ctx.entities) {
      console.log(`Entity ${entityId} has position: ${position.x}`);
    }
  }
}

world.registerSystem(new VelocitySystem());
world.registerSystem(new LoggingSystem());

const entity1 = world.createEntity();
world.addComponent(entity1, new Position(0));
world.addComponent(entity1, new Velocity(1));

const entity2 = world.createEntity();
world.addComponent(entity2, new Position(10));
world.addComponent(entity2, new Velocity(0.5));

function update() {
  world.update();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);