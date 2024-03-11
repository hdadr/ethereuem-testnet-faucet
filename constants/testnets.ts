export type Network = {
  id: number;
  label: string;
  name: string;
};

export const TESTNETS: Network[] = [
  { id: 42, label: "Kovan", name: "kovan" },
  { id: 4, label: "Rinkeby", name: "rinkeby" },
  { id: 3, label: "Ropsten", name: "ropsten" },
  { id: 5, label: "Görli", name: "goerli" },
];
