export interface Article {
  id: string;
  title: string;
  color: string;
  brand: string;
  kind: string;
  size: string;
  updated: string;
}

interface FakeDB {
  [key: string]: Article;
}

const FAKE_DATABASE: FakeDB = {
  "1": {
    id: "1",
    title: "Medium weight burgundy cardigan",
    color: "burgundy",
    brand: "Picadilly Fashions",
    kind: "sweater",
    size: "2X",
    updated: "2020-12-13T00:00:00Z",
  },
  "2": {
    id: "2",
    title: "Grey heart-pattern t-shirt",
    color: "grey",
    brand: "Torrid",
    kind: "shirt",
    size: "3X",
    updated: "2021-01-11T12:00:00Z",
  },
};

export function getArticle(id: string): Article | null {
  return FAKE_DATABASE[id] ?? null;
}
