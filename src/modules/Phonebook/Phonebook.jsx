import { Component } from "react";
import { nanoid } from 'nanoid';
import styles from './phonebook.modules.css';
import ContactList from "./ContactList/ContactList";
import Filter from "./Filter/Filter";
import ContactForm from "./ContactForm/ContactForm";

class Phonebook extends Component {

    state = {
        contacts: [],
        filter: '',

    }

    componentDidMount() {
        const contacts = JSON.parse(localStorage.getItem("my-contacts"));
        if (contacts && contacts.length) {
            this.setState({ contacts })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { contacts } = this.state;
        if (prevState.contacts.length !== contacts.length) {
            localStorage.setItem("my-contacts", JSON.stringify(contacts))
        }
    }

    addContact = ({ name, number }) => {

        this.setState(prevState => {
            const { contacts } = prevState;
            if (this.isDublicate(name)) {
                return alert(`${name} is alredy in contacts`)
            }
            const newContact = {
                id: nanoid(),
                name,
                number,
            }
            return { contacts: [newContact, ...contacts] }
        })
    }

    removeContact = (id) => {
        this.setState(({ contacts }) => {
            const newContacts = contacts.filter(contact => contact.id !== id);
            return { contacts: newContacts }
        })
    }


    isDublicate(name) {
        const normName = name.toLowerCase();
        const { contacts } = this.state;
        const duble = contacts.find(({ name }) => {
            return (name.toLowerCase() === normName)
        })
        return Boolean(duble)
    }

    getFilteredContacts() {
        const { filter, contacts } = this.state;
        if (!filter) {
            return contacts
        }
        const normFilter = filter.toLowerCase()
        const result = contacts.filter(({ name, number }) => {
            return (name.toLowerCase().includes(normFilter) || number.toLowerCase().includes(normFilter))
        })
        return result;
    }

    handelFilter = ({ target }) => {
        this.setState({ filter: target.value })
    }

    render() {
        const { addContact, removeContact, handelFilter } = this;
        const contacts = this.getFilteredContacts();

        return (
            <div>
                <h3>Phonebook</h3>
                <div>
                    <div className={styles.wrapper}>
                        <h4>Name</h4>
                        <ContactForm onSubmit={addContact} />
                    </div>
                    <div>
                        <h4>Contacts</h4>
                        <Filter handelChange={handelFilter} />
                        <ContactList removeContact={removeContact} contacts={contacts} />
                    </div>
                </div>
            </div>
        )
    }
}


export default Phonebook;