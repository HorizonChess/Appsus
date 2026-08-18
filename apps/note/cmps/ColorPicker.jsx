const { useState } = React

import { colorOptions } from "../data/note-color-options.js"

export function ColorPicker({ isPickerShown, key, onChangeStyle }) {

    if (!isPickerShown) return <span key={key}></span>

    return <div className="note-color-picker" key={key}>
        {colorOptions.map(colorOption => {
            return <div>
                <input type="radio" id={colorOption} name="background-color" value={colorOption} onChange={onChangeStyle} />
                <label for={colorOption} style={{backgroundColor:colorOption}}>Huey</label>
            </div>
        })}

    </div>
}