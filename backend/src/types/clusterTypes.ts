import { ClusterStatus } from '../constants/clusterStatus';

export interface ICluster {
  farmerId: string;
  location: {
    type: string;
    coordinates: number[];
  };
  quantity: number;
  price: number;
  status: ClusterStatus;
  cropType: string;
}
