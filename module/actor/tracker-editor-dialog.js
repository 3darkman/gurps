export class ResourceTrackerEditorDialog extends Dialog {
  constructor(actor, path) {
    super({
      title: 'Resource Tracker Editor',
      buttons: {
        one: {
          icon: '<i class="fas fa-save"></i>',
          label: 'Update',
          callback: () => {
            this._updateTracker()
          },
        },
      },
      default: 'one',
    })

    this._actor = actor
    this._path = path
    this._tracker = getProperty(this._actor.data.data, path)
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/gurps/templates/resource-editor-popup.html',
      width: 360,
      popOut: true,
      minimizable: false,
      jQuery: false,
      resizable: true,
    })
  }

  /** @override */
  getData(options) {
    const data = super.getData(options)
    data.tracker = this._tracker
    return data
  }

  async _updateTracker(html) {
    let update = {}
    update[`data.${this._path}`] = this._tracker

    this._actor.update(update)
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html)

    html.find('.name input').change(ev => {
      this._tracker.name = ev.currentTarget.value
    })

    html.find('.inputs .current').change(ev => {
      this._tracker.value = parseInt(ev.currentTarget.value)
    })

    html.find('.inputs .minimum').change(ev => {
      this._tracker.min = parseInt(ev.currentTarget.value)
    })

    html.find('.inputs .maximum').change(ev => {
      this._tracker.max = parseInt(ev.currentTarget.value)
    })

    html.find('#threshold-add').click(() => {
      if (!this._tracker.thresholds) {
        this._tracker.thresholds = []
      }

      this._tracker.thresholds.push({
        comparison: '>',
        operator: '×',
        value: 1,
        condition: 'Normal',
        color: '#FFFFFF',
      })
      this.render(false)
    })

    html.find('[name="delete-threshold"]').click(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds.splice(index, 1)
      this.render(false)
    })

    html.find('[name="comparison"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].comparison = ev.currentTarget.value
    })

    html.find('[name="operator"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].operator = ev.currentTarget.value
    })

    html.find('[name="value"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].value = parseFloat(ev.currentTarget.value)
    })

    html.find('[name="condition"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].condition = ev.currentTarget.value
    })

    html.find('[name="color"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].color = ev.currentTarget.value
    })
  }
}
