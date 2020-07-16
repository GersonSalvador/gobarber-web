import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, AnimationContainer, Background } from './styles';
import api from '../../services/api';

import { useToast } from '../../hooks/Toast';

import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  nome: string;
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Required Name'),
          email: Yup.string()
            .required('Required E-mail')
            .email('Enter a valid email'),
          password: Yup.string().min(12, '12 characters length minimum'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Congrats!',
          description: "You're an official GoBarber user, now!",
        });
      } catch (err) {
        console.log(err);

        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        addToast({
          type: 'error',
          title: 'Oh no!',
          description: "We cound't create your account. Plase try again later.",
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <AnimationContainer>
        <img src={logoImg} alt="GoBarger" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>SignUp</h1>

          <Input type="text" icon={FiUser} name="name" placeholder="Name" />
          <Input type="text" icon={FiMail} name="email" placeholder="E-mail" />

          <Input
            type="password"
            icon={FiLock}
            name="password"
            placeholder="Password"
          />
          <Button type="submit">SignUp</Button>

          <Link to="/">
            <FiArrowLeft />
            Back to Login
          </Link>
        </Form>
      </AnimationContainer>
    </Container>
  );
};
export default SignUp;
