using LogPeople.Contexts;
using LogPeople.Domains;
using LogPeople.Interfaces;
using LogPeople.Utils;
using System.Linq;
using System.Text.RegularExpressions;

namespace LogPeople.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly LogPeopleContext ctx;

        public UsuarioRepository(LogPeopleContext appContext)
        {
            ctx = appContext;
        }

        public Usuario BuscarPorId(int idUsuario)
        {
            return ctx.Usuarios.FirstOrDefault(u => u.IdUsuario == idUsuario);
        }

        public Usuario Login(string email, string senha)
        {
            var usuario = ctx.Usuarios.FirstOrDefault(u => u.Email == email);
            var rgx = new Regex(@"^\$\d[a-z]\$\d\d\$.{53}");

            if(usuario == null)
            {
                return null;
            }

            if (rgx.IsMatch(usuario.Senha))
            {
                bool comparado = Criptografia.Comparar(senha, usuario.Senha);
                if (comparado)
                    return usuario;
            }
            else
            {
                AtualizarCripto(usuario, usuario.IdUsuario);
                Login(usuario.Email, usuario.Senha);
            }

            return null;
        }

        public void AtualizarCripto(Usuario usuarioBuscado, int id)
        {
            Usuario usuarioNoBanco = BuscarPorId(id);

            string senhaAtualizada = Criptografia.GerarHash(usuarioBuscado.Senha);

            usuarioNoBanco.Senha = senhaAtualizada;

            ctx.Usuarios.Update(usuarioNoBanco);

            ctx.SaveChanges();
        }

        public void Atualizar(Usuario usuario)
        {
            Usuario usuarioBuscado = BuscarPorId(usuario.IdUsuario);

            if (usuario.Foto != null)
            {
                usuarioBuscado.Foto = usuario.Foto;
            }

            if (usuario.IdTipo != 0)
            {
                usuarioBuscado.IdTipo = usuario.IdTipo;
            }

            if (usuario.Email != null)
            {
                usuarioBuscado.Email = usuario.Email;
            }

            if (usuario.Senha != null)
            {
                usuarioBuscado.Senha = usuario.Senha;
            }

            if (usuario.Ativado != null)
            {
                usuarioBuscado.Ativado = usuario.Ativado;
            }

            if (usuario.Nome != null)
            {
                usuarioBuscado.Nome = usuario.Nome;
            }

            ctx.Usuarios.Update(usuarioBuscado);

            ctx.SaveChanges();
        }
    }
}
