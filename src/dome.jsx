import { observable, action } from 'mobx'
import React, { Component } from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { observer, PropTypes as ObservablePropTypes } from 'mobx-react'

class Store {
    @observable cache = {
        queue: []
    }

    @action.bound refresh() {
        this.cache.queue.push(1)
    }
}

const store = new Store();

// Bar Foo 
@observer
class Bar extends Component {
    static propTypes = {
        queue: ObservablePropTypes.observableArray //PropTypes.array
    }
    render() {
        const { queue } = this.props
        return (
            <span>{queue.length}</span>
        )
    }
}

class Foo extends Component {
    static propTypes = {
        cache: ObservablePropTypes.observableObject
    }


    render() {
        const { cache } = this.props
        return (
            <div>
                <button onClick={this.props.refresh}>refresh</button>
                <Bar queue={cache.queue}></Bar>
            </div>
        )
    }
}

ReactDom.render(<Foo cache={store.cache} refresh={store.refresh} />, document.querySelector('#root'))