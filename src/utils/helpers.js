export function paginate(direction) {
  this.setState(prevState => {
    return {page: prevState.page += direction}
  });
}
