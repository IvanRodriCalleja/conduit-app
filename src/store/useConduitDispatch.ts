import { useDispatch } from 'react-redux';
import type { Dispatch } from './types';


export const useConduitDispatch = () => useDispatch<Dispatch>();
