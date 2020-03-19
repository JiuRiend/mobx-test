import { trace, toJS, spy, observable, action, computed, isObservable, observe } from 'mobx'
import React, { Component, Fragment } from 'react'
import ReactDom from 'react-dom'
import { observer, PropTypes as ObservablePropTypes } from 'mobx-react'
import PropTypes from 'prop-types'

spy(event => {
    // console.log(event)
});

class Todo {
    id = Math.random();
    @observable title = '';
    @observable finished = false;

    constructor(title) {
        this.title = title
    }

    @action.bound toggle() {
        this.finished = !this.finished
    }
}

class Store {
    @observable todos = [];

    disposers = []

    constructor() {
        observe(this.todos, change => {
            this.disposers.forEach(disposer => {
                disposer()
            })

            this.disposers = [];
            for (let todo of change.object) {
                var disposer = observe(todo, changex => {
                    // console.log(changex)
                    this.save()
                })
                this.disposers.push(disposer)
            }

            // console.log(change)
            this.save()
        });
    }
    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos))
        // console.log(toJS(this.todos))
    }

    @action.bound createTodo(title) {
        this.todos.unshift(new Todo(title));
    }

    @action.bound removeTodo(todo) {
        this.todos.remove(todo);
    }

    @computed get left() {
        return this.todos.filter(todo => !todo.finished).length
    }
}

var store = new Store();


@observer
class TodoItem extends Component {
    static propTypes = {
        todo: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            finished: PropTypes.bool.isRequired,
        })
    }

    handleClick = () => {
        this.props.todo.toggle()
    }

    render() {
        const { todo } = this.props
        return (
            <Fragment>
                <input type="checkbox" className='toggle' defaultChecked={todo.finished} onClick={this.handleClick} />
                <span className={['title', todo.finished && 'finished'].join(' ')}>{todo.title}</span>
            </Fragment>
        )
    }
}

@observer
class TodoFooter extends Component {
    render() {
        const { left } = this.props.store
        return (
            <footer>
                {left} item(s) unfinised
            </footer>
        )
    }
}

@observer
class TodoView extends Component {
    static propTypes = {}
    render() {
        const { todos } = this.props
        const { removeTodo } = this.props.store
        return todos.map(todo => {
            return <li key={todo.id} className='todo-item'>
                <TodoItem todo={todo} />
                <span className='delete' onClick={(e) => removeTodo(todo)}>X</span>
            </li>
        })
    }
}

@observer
class TodoHeader extends Component {
    static propTypes = {}
    state = {
        inputValue: ""
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var { createTodo } = this.props.store
        var { inputValue } = this.state
        createTodo(inputValue)
        this.setState({
            inputValue: ""
        })
    }

    handleChange = (e) => {
        var inputValue = e.target.value
        this.setState({
            inputValue
        })
    }

    render() {
        const { inputValue } = this.state
        return <header>
            <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.handleChange} value={inputValue} placeholder='What to be finished?' />
            </form>
        </header>
    }
}

@observer
class TodoList extends Component {
    static propTypes = {
        store: PropTypes.shape({
            createTodo: PropTypes.func,
            todos: ObservablePropTypes.observableArrayOf(ObservablePropTypes.observableObject).isRequired
        }).isRequired
    };



    render() {
        trace()
        const { store } = this.props
        return (
            <div className='todo-list'>
                <TodoHeader store={store} />
                <ul>
                    <TodoView todos={store.todos} store={store} />
                </ul>
                <TodoFooter store={store} />
            </div>
        )
    }
}

ReactDom.render(<TodoList store={store} />, document.querySelector('#root'))