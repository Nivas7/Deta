// types/SankeyTypes.ts

export interface Node {
    name: string;
}

export interface Link {
    source: string | number; // when parsed: string, when mapped: number
    target: string | number;
    value: number;
}

function parseFlows(input: string): { nodes: Node[]; links: Link[] } {
    const lines = input.trim().split("\n");
    const nodesSet = new Set<string>();
    const links: Link[] = [];

    lines.forEach(line => {
        const match = line.match(/^(.+?)\s*->\s*(.+?):\s*(\d+)$/);
        if (match) {
            const [, source, target, value] = match;
            nodesSet.add(source.trim());
            nodesSet.add(target.trim());
            links.push({
                source: source.trim(),
                target: target.trim(),
                value: +value,
            });
        }
    });

    const nodes: Node[] = Array.from(nodesSet).map(name => ({ name }));
    const nodeIndex = new Map(nodes.map((n, i) => [n.name, i]));

    links.forEach(l => {
        l.source = nodeIndex.get(l.source as string)!; // ✅ These are now numbers
        l.target = nodeIndex.get(l.target as string)!;
    });

    return { nodes, links };
}
