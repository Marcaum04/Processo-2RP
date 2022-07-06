using LogPeople.Domains;

namespace LogPeople.Interfaces
{
    public interface IUsuarioRepository
    {
        Usuario Login(string email, string senha);
        Usuario BuscarPorId(int idUsuario);
        void Atualizar(Usuario usuario);
    }
}
