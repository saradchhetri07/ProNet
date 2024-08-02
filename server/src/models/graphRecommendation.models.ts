export class GraphRecommendation {
  private graph: Map<number, Set<number>>;
  private confirmedConnections: number[][] = [];

  constructor(connections: number[][]) {
    this.graph = new Map();
    this.confirmedConnections = connections;
  }

  addConnection(userId: number, connectionUserId: number): void {
    if (!this.graph.has(userId)) {
      this.graph.set(userId, new Set());
    }
    if (!this.graph.has(connectionUserId)) {
      this.graph.set(connectionUserId, new Set());
    }
    this.graph.get(userId)!.add(connectionUserId);
    this.graph.get(connectionUserId)!.add(userId);
  }

  getRecommendationBFS(userId: number, maxDepth: number = 5): number[] {
    const visited = new Set<number>([userId]);
    const queue: [number, number][] = [[userId, 0]];
    const recommendations: number[] = [];

    while (queue.length > 0) {
      const [currentUser, depth] = queue.shift()!;

      if (depth > maxDepth) {
        break;
      }

      const neighbours = this.graph.get(currentUser) || new Set<number>();

      for (const neighbor of neighbours) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, depth + 1]);
          if (depth > 0) {
            // Don't recommend direct connections
            recommendations.push(neighbor);
          }
        }
      }
    }
    return recommendations;
  }

  setupAndUseRecommendationSystem() {
    for (const [userId, connectionUserId] of this.confirmedConnections) {
      this.addConnection(userId, connectionUserId);
    }
  }
}
