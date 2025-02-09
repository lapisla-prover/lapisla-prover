# Contribution to lapisla-prover 

First of all, lapisla-prover team is always welcome to any contribution to the project! 😸

This is a guide to help you contribute to the project. 
Please read this guide before contributing to the project.

## Code of Conduct

All contributors are expected to adhere to the following code of conduct:

- Be respectful to others.
- Be constructive in your feedback.
- Any form of harassment or discrimination will not be tolerated.


Violations of the Code of Conduct will be reviewed by the maintainers. Depending on the severity, actions may include a warning, request for revision, or in extreme cases, removal of the contribution. If you witness a violation, please report it to the maintainers.


## What should I know before contributing?

lapisla-prover consists of several components. Depending on the component, different types of contributions may be needed:

- **[kernel](packages/kernel)** (core logic): Algorithm improvements, bug fixes, optimizations.
- **[webfront](apps/web)** (frontend): UI improvements, accessibility fixes, UX enhancements.
- **[backend](apps/backend)** (server-side logic): API improvements, security enhancements, database optimizations.


## How can I contribute?

### Opening Issues

If you find a bug, have a question, or have an idea to enhance the project, you can open an issue in the repository.

Before opening an issue, please check if there is already an issue that covers the same topic. If there is, you can add a comment to the existing issue.

#### 1. Reporting Bugs

If you find a bug in the project, please open an issue in the repository. Make sure to include the following information:

- Steps to reproduce the bug as detailed as possible.
- Expected behavior.
- Actual behavior.
- Environment information (especially the browser version if it is a web issue).

If you can determine the which component the bug is related to, please include that information as well.


#### 2. Suggesting Enhancements

If you have an idea to enhance the project, please open an issue in the repository. 

It is recommended to reference similar features from other projects, including detailed information about their implementation.

### Making Pull Requests

Before submitting a pull request, consider the following:

#### Do I need to open an issue first?
- **Yes**, if you are introducing a new feature, refactoring core components, or making major changes to logic.
- **No**, if the change is small (e.g., fixing typos, minor UI tweaks, or simple bug fixes).

#### Steps to submit a pull request:
1. **Fork the repository** and create a new branch for your changes.
2. **Ensure your code follows the style guide** and is well-documented.
3. **Test your changes locally** before submitting.
4. **Open a pull request**, referencing the related issue if applicable.



#### 1. Commit Messages

Please follow the commit message format below:

```
<type>(<scope>): <subject>
```

For example:

```
fix(kernel): Fix a bug in the kernel
```

`<type>` can be one of the following:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

`<scope>` is optional and can be the component the commit is related to. 
For example, `kernel`, `webfront`, `ui`, etc.

`<subject>` is a short description of the change.
It should follow the following rules:
- Use the imperative mood. For example, "Modify a feature" instead of "Modifying a feature".
- Use the present tense. For example, "Add a feature" instead of "Added a feature".
- Limit the subject to 72 characters or less.


#### 2. Pull Request Template

When making a pull request, please use the following template:

```
## Description

Describe the changes made in the pull request.

## Related Issue

If the pull request is related to an issue, please reference the issue here using the following format:

- fix #<issue number>

## Checklist

- [ ] I have read the CONTRIBUTING.md file.
- [ ] I have followed the commit message format.
- [ ] I have tested the changes locally.
- [ ] I have added tests for the changes (if necessary).
- [ ] I have updated the documentation (if necessary).
```

## Code Review

All pull requests will be reviewed by the maintainers. The maintainers may request changes to the pull request.

If the maintainers request changes, please make the changes and push the changes to the same branch. 


## License

By contributing to the project, you agree that your contributions will be licensed under the [LICENSE](LICENSE) file in the repository.


