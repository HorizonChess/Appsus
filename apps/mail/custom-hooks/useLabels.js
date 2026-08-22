import { mailService } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React

// there is no label entity - the list is whatever the mails carry, so it has to
// reload on the same event the folder counts do
export function useLabels() {
    const [labels, setLabels] = useState([])

    useEffect(() => {
        loadLabels()
        return eventBusService.on('mails-changed', loadLabels)
    }, [])

    function loadLabels() {
        mailService.getLabels()
            .then(setLabels)
            .catch(err => console.log('Had issues loading labels', err))
    }

    return labels
}
