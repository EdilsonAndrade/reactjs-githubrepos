import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { GoMarkGithub } from 'react-icons/go';

import { Link } from 'react-router-dom';
import Container from '../components/Container/index';
import { Form, SubmitButton, List, Logo } from './styles';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: false });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      this.setState({
        error: false,
      });
      this.setState({ loading: true });
      const { newRepo, repositories } = this.state;

      const response = await api.get(`/repos/${newRepo}`);

      const existRepositories = repositories.find(
        repo => repo.name === response.data.full_name
      );
      if (existRepositories) {
        throw new Error('Repositório já adicionado');
      }
      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data], // conceito de mutabilidade, copiando as informações ja existentes e adicionando a que eu quero,
        newRepo: '',
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  };

  render() {
    const { newRepo, loading, repositories, error } = this.state;
    return (
      <>
        <Logo>
          <GoMarkGithub />
        </Logo>
        <Container>
          <div>
            <h1>
              <FaGithubAlt />
              Repositórios
            </h1>

            <Form onSubmit={this.handleSubmit}>
              <input
                value={newRepo}
                onChange={this.handleInputChange}
                type="text"
                error={error ? 1 : 0}
              />

              <SubmitButton loading={loading ? 1 : 0}>
                {loading ? (
                  <FaSpinner color="#fff" size={14} />
                ) : (
                  <FaPlus color="#FFF" size={14} />
                )}
              </SubmitButton>
            </Form>

            <List>
              {repositories.map(repo => (
                <li key={repo.name}>
                  <span>{repo.name}</span>
                  <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                    Detalhe
                  </Link>
                </li>
              ))}
            </List>
          </div>
        </Container>
      </>
    );
  }
}
