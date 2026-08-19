const { useState } = React

import { colorOptions } from "../data/note-color-options.js"

export function ColorPicker({ isPickerShown, pickerKey, onChangeStyle, style }) {
    if (!isPickerShown) return <span key={pickerKey}></span>

    return <div className="note-color-picker" key={pickerKey}>
        {colorOptions.map(colorOption => {
            return <div key={`${pickerKey}-${colorOption}`}>
                <label
                    className={`color-picker-label ${colorOption === "#ffffff" ? 'empty' : ''}`}
                    htmlFor={`${pickerKey}-${colorOption}`}
                    name="background-color"
                    style={{ backgroundColor: colorOption }}>

                </label>

                <input
                    type="radio"
                    checked={colorOption === style.backgroundColor}
                    className="picker-option"
                    id={`${pickerKey}-${colorOption}`}
                    name="background-color"
                    value={colorOption}
                    onChange={onChangeStyle} />


            </div>
        })}

    </div>
}