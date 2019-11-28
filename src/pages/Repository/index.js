import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { GoMarkGithub } from 'react-icons/go';
import api from '../../services/api';
import Container from '../components/Container/index';
import { Loading, Owner, Issues, RepositoryMain, Filter, Page } from './styles';
import auth from '../../config/auth';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    issueType: 'open',
    page: 1,
    itensPerPage: 3,
    firstButtonNumber: 0,
    totalButtonsPage: [],
    numberOfPages: 0,
  };

  async componentDidMount() {
    const { issueType, page } = this.state;

    const [repository, issues, totalIssues] = await Promise.all([
      this.getRepository(),
      this.getIssues(issueType, page),
      this.getTotalIssues(issueType),
    ]);
    this.setButtonsPagination(totalIssues, 1);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });

    this.setFilterButton('open');
  }

  setButtonsPagination = (totalIssues, startNumber) => {
    const { itensPerPage } = this.state;
    const number = startNumber;
    let numberOfPages = 0;
    if ((totalIssues / itensPerPage) % 2 === 0) {
      numberOfPages = totalIssues / itensPerPage;
    } else {
      numberOfPages = Math.round(totalIssues / itensPerPage);
    }
    let buttonsInPage = [];
    if (totalIssues > itensPerPage) {
      buttonsInPage.push(number);

      if (numberOfPages - number > 0) {
        buttonsInPage.push(number + 1);
      } else {
        buttonsInPage.push(number - 2);
      }
      if (numberOfPages - (number + 2) > 0) {
        buttonsInPage.push(number + 2);
      } else {
        buttonsInPage.push(number - 1);
      }

      buttonsInPage = buttonsInPage.sort((a, b) => {
        return a - b;
      });
    }

    let extract = 0;
    if (totalIssues > itensPerPage) {
      extract = number - 1;
      if (numberOfPages - number <= 2) {
        extract = numberOfPages - (numberOfPages - number + 2);
      }
    }

    this.setState({
      totalButtonsPage: buttonsInPage,
      firstButtonNumber: extract,
      numberOfPages: numberOfPages === buttonsInPage[2] ? 0 : numberOfPages,
    });
  };

  handleButtonNumberPage = async pageNumber => {
    const { issueType } = this.state;
    this.setState({
      loading: true,
    });
    const [issues, totalIssues] = await Promise.all([
      this.getIssues(issueType, pageNumber),
      this.getTotalIssues(issueType),
    ]);
    this.setButtonsPagination(totalIssues, pageNumber);

    this.setState({
      issues: issues.data,
      loading: false,
      page: pageNumber,
    });

    this.setFilterButton(issueType);
  };

  setFilterButton = id => {
    const removeButton = document.querySelector("button[active='1']");
    if (removeButton) {
      removeButton.removeAttribute('active');
    }
    const button = document.getElementById(id);

    if (button) {
      button.setAttribute('active', '1');
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { page } = this.state;
    const buttonId = e.target.id;
    this.setState({
      loading: true,
    });
    const [repository, issues, totalIssues] = await Promise.all([
      this.getRepository(),
      this.getIssues(buttonId, page),
      this.getTotalIssues(buttonId),
    ]);
    this.setButtonsPagination(totalIssues, 1);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      issueType: buttonId,
    });

    this.setFilterButton(buttonId);
  };

  getRepository = () => {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);
    return api.get(`/repos/${repoName} `, { ...auth });
  };

  getIssues = async (issueType, page) => {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { itensPerPage } = this.state;
    return api.get(`/repos/${repoName}/issues`, {
      params: {
        state: issueType,
        per_page: itensPerPage,
        page,
      },
      ...auth,
    });
  };

  getTotalIssues = async issueType => {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const totalIssues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: issueType,
      },
      ...auth,
    });
    return totalIssues.data !== null ? totalIssues.data.length : 0;
  };

  render() {
    const {
      repository,
      issues,
      loading,
      totalButtonsPage,
      numberOfPages,
      firstButtonNumber,
    } = this.state;

    if (loading) {
      return (
        <Loading loading={loading && loading.toString()}>
          <GoMarkGithub />
        </Loading>
      );
    }

    return (
      <>
        <RepositoryMain>
          <Container>
            <Owner>
              <Link to="/">Voltar</Link>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <strong>{repository.name}</strong>
              <p>{repository.description}</p>

              <Filter>
                <div>
                  <button type="submit" id="all" onClick={this.handleSubmit}>
                    Todos
                  </button>
                  <button type="submit" id="open" onClick={this.handleSubmit}>
                    Abertos
                  </button>
                  <button type="submit" id="closed" onClick={this.handleSubmit}>
                    Fechados
                  </button>
                </div>
              </Filter>
            </Owner>
            <Issues>
              {issues.map(issue => (
                <li key={String(issue.id)}>
                  <img src={issue.user.avatar_url} alt={issue.user.login} />
                  <div>
                    <strong>
                      <a href={issue.url}>{issue.title}</a>
                      <span>
                        {issue.labels.map(label => (
                          <span key={label.id}>{label.name}</span>
                        ))}
                      </span>
                    </strong>
                    <p>{issue.user.login}</p>
                  </div>
                </li>
              ))}
            </Issues>
            <Page>
              {firstButtonNumber >= 1 ? (
                <>
                  <button
                    type="button"
                    id="backward"
                    onClick={() => this.handleButtonNumberPage(1)}
                  >
                    <span>&lt;&lt;</span>
                  </button>
                  <button
                    type="button"
                    id="backward"
                    onClick={() =>
                      this.handleButtonNumberPage(firstButtonNumber)
                    }
                  >
                    <span>&lt;</span>
                  </button>
                </>
              ) : (
                ''
              )}
              {totalButtonsPage.map(numberPage => {
                return (
                  <button
                    key={numberPage}
                    type="button"
                    onClick={() => this.handleButtonNumberPage(numberPage)}
                  >
                    {numberPage}
                  </button>
                );
              })}
              {numberOfPages > 1 ? (
                <button
                  id="foward"
                  type="button"
                  onClick={() => this.handleButtonNumberPage(numberOfPages)}
                >
                  <span> &gt;&gt;</span>
                </button>
              ) : (
                ''
              )}
            </Page>
          </Container>
        </RepositoryMain>
      </>
    );
  }
}
