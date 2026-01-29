import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  paintedData: {
    [key: string]: string | undefined;
  };
}

const initialState: EditorState = {
  paintedData: {}
};

interface SetPaintedDataPayload {
  optionId: string;
  paintedData: string;
}

type ClearPaintedDataPayload = string;

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setPaintedData: (
      state,
      action: PayloadAction<SetPaintedDataPayload>
    ) => {
      state.paintedData[action.payload.optionId] = action.payload.paintedData;
    },
    clearPaintedData: (
      state,
      action: PayloadAction<ClearPaintedDataPayload>
    ) => {
      delete state.paintedData[action.payload];
    },
    clearAllPaintedData: (state: EditorState) => {
      state.paintedData = {} as EditorState['paintedData'];
    }
  }
});

export const { setPaintedData, clearPaintedData, clearAllPaintedData } = editorSlice.actions;
export default editorSlice.reducer;
