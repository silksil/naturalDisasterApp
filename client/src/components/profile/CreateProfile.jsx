import React, { Component } from 'react';
import { Field, FieldArray, reduxForm} from 'redux-form';
import { connect } from 'react-redux';

import { submitProfile} from '../../actions/index.js';
import InputField from '../shared/form/InputField';
import Switch from '../shared/form/Switch';
import DropDownSelector from '../shared/form/DropDownSelector';
import { nationalitiesList } from '../../utils/nationalitiesList';
import Skills from './Skills';
import validateEmails from '../../utils/validateEmails'

class CreateProfile extends Component {
  onSubmit(values) {
    const { history} = this.props;
    this.props.submitProfile(values, history)
  }

  render() {
     const { handleSubmit} = this.props;
     const onOffSwitch = ['On', 'Off']
     return (
       <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
         <Field name="firstName" label="First Name" component={InputField}/>
         <Field name="lastName" label="Last Name" component={InputField}/>
         <Field name="email" label="Email" component={InputField}/>
         <Field name="notification" label="Disaster Notifications" component={Switch} data={onOffSwitch}/>
         <Field name="nationality" label="Nationality" component={DropDownSelector} data={nationalitiesList}/>
         <FieldArray name="skills" component={Skills}/>
       <button type="submit"> Submit </button>
      </form>
   );
  }
}

function validate(values) {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Enter a first name';
  }
  if (!values.lastName) {
    errors.lastName = 'Enter a last name';
  }
  errors.email = validateEmails(values.email || '');
  if (!values.nationality) {
    errors.nationality = 'Enter a nationality';
  }
  if (values.skills) {
    const skillArrayErrors = [];
    values.skills.forEach((skill, skillIndex) => {
      const skillError = {};
      if (!skill.type) {
        skillError.type = 'Skill type required';
        skillArrayErrors[skillIndex] = skillError;
      }
      if (!skill.level) {
        skillError.level = 'Skill level required';
        skillArrayErrors[skillIndex] = skillError;
      }
    });
    if (skillArrayErrors.length) {
      errors.skills = skillArrayErrors;
    }
  }
  return errors;
}


export default reduxForm({
  validate,
  form: 'Profile'
})(
  connect(null, { submitProfile })(CreateProfile)
)