import { Dispatch } from "react";
import { Alignment, BioBlock, CharacterSize } from "./charSheet";
import { ReducerAction } from "./reducer";

export function Bio({state, dispatch}: {state: BioBlock, dispatch: Dispatch<ReducerAction>}) {

  function handleChange(field: 'name' | 'race' | 'gender' | 'height' | 'weight' | 'hair' | 'eyes' | 'skin' | 'age' | 'deity' | 'background' | 'languages', fieldValue: string) {
    dispatch({type: 'changeBioField', payload: {field: field, value: fieldValue}})
    console.log('handle change: changing field ' + field + ' (' + state[field] + ') ' + ' to ' + fieldValue);
  }
  
  function handleSelectChange(field: 'size' | 'align', fieldValue: string) {
    if (field == 'size') {
      dispatch({type: 'changeBioSize', payload: {value: CharacterSize[fieldValue as keyof typeof CharacterSize]}})
    } else {
      dispatch({type: 'changeBioAlign', payload: {value: Alignment[fieldValue as keyof typeof Alignment]}})
    }
  }

  function handleSubmit(event: { preventDefault: any }) {
    event.preventDefault;
  }

  return (
    <div onSubmit={handleSubmit}>
      <h2>Character info</h2>
      <label>Name:
        <input value={state.name} onChange={(e) => handleChange('name', e.target.value)}/>
      </label>
      <label>Race:
        <input value={state.race} onChange={(e) => handleChange('race', e.target.value)}/>
      </label>
      <label>Size:
        <select value={state.size} onChange={(e) => handleSelectChange('size', e.target.value)}>
          {Object.values(CharacterSize).map((size) => {
            return(<option key={size} value={size}>{size}</option>)
          })}
        </select>
      </label>
      <label>Gender:
        <input value={state.gender} onChange={(e) => handleChange('gender', e.target.value)}/>
      </label>
      <label>Height:
        <input type='number' value={state.height} onChange={(e) => handleChange('height', e.target.value)}/>
      </label>
      <label>Weight:
        <input value={state.weight} onChange={(e) => handleChange('weight', e.target.value)}/>
      </label>
      <label>Hair:
        <input value={state.hair} onChange={(e) => handleChange('hair', e.target.value)}/>
      </label>
      <label>Eyes:
        <input value={state.eyes} onChange={(e) => handleChange('eyes', e.target.value)}/>
      </label>
      <label>Skin:
        <input value={state.skin} onChange={(e) => handleChange('skin', e.target.value)}/>
      </label>
      <label>Age:
        <input type="number" value={state.age} onChange={(e) => handleChange('age', e.target.value)}/>
      </label>
      <label>Alignment:
        <select value={state.align} onChange={(e) => handleSelectChange('align', e.target.value)}>
          {Object.values(Alignment).map((align) => {
            return(<option key={align} value={align}>{align}</option>)
          })}
        </select>
      </label>
      <label>Deity:
        <input value={state.deity} onChange={(e) => handleChange('deity', e.target.value)}/>
      </label>
      <label>Homeland & background occupation:
        <input value={state.background} onChange={(e) => handleChange('background', e.target.value)}/>
      </label>
      <label>Languages:
        <input value={state.languages} onChange={(e) => handleChange('languages', e.target.value)}/>
      </label>
    </div>
  )
}