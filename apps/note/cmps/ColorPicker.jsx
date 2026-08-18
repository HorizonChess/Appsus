const { useState } = React

import { colorOptions } from "../data/note-color-options.js"

export function ColorPicker({ isPickerShown, key, onChangeStyle, style }) {
    console.log('key', key)
    if (!isPickerShown) return <span key={key}></span>

    return <div className="note-color-picker" key={key}>
        {colorOptions.map(colorOption => {
            return <div>
                <label
                    className={`color-picker-label ${colorOption === "#ffffff" ? 'empty' : ''}`}
                    htmlFor={`${key}-${colorOption}`}
                    name="background-color"
                    style={{ backgroundColor: colorOption }}>

                </label>

                <input
                    type="radio"
                    checked={colorOption === style.backgroundColor}
                    className="picker-option"
                    id={`${key}-${colorOption}`}
                    name="background-color"
                    value={colorOption}
                    onChange={onChangeStyle} />


            </div>
        })}

    </div>
}