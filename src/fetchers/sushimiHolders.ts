import request, { gql } from "graphql-request";

import { SUSHIMI_HOLDER_SUBGRAPH } from "../constants";

const usersQuery = gql`
  query UsersQuery(
    $first: Int = 1000
    $where: User_filter
    $block: Block_height
  ) {
    users(first: $first, where: $where, block: $block) {
      id
      nftCount
      nfts(first: 1000) {
        id
      }
    }
  }
`;

const nftQuery = gql`
  query NFTQuery($id: String!, $where: NFT_Filter, $block: Block_height) {
    nft(id: $id, where: $where, block: $block) {
      id
      user {
        id
        nftCount
      }
    }
  }
`;

interface NftsByHoldersHolder {
  holder: string;
  holders?: never;
  block?: number;
}

interface NftsByHoldersHolders {
  holder?: never;
  holders: string[];
  block?: number;
}

type NftByHoldersProps = NftsByHoldersHolder | NftsByHoldersHolders;

export async function getNftsByHolders({
  holder,
  holders,
  block,
}: NftByHoldersProps): Promise<number[]> {
  const addresses = holders ?? [holder];

  const { users } = await request(SUSHIMI_HOLDER_SUBGRAPH, usersQuery, {
    block: block ? { number: block } : undefined,
    where: { id_in: addresses.map((address) => address!.toLowerCase()) },
  });

  if (users.length === 0) return [];

  return users.reduce(
    (acc: any, cur: any) => [
      ...acc,
      cur.nfts.map((nft: { id: string }) => Number(nft.id)),
    ],
    []
  );
}

export async function getHolderByNft(
  nftId: number,
  block?: number
): Promise<number[] | undefined> {
  const { nft } = await request(SUSHIMI_HOLDER_SUBGRAPH, nftQuery, {
    id: String(nftId),
    block: block ? { number: block } : undefined,
  });

  if (!nft) return undefined;

  return nft.user.id;
}
