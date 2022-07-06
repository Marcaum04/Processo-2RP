using LogPeople.Contexts;
using LogPeople.Domains;
using LogPeople.Interfaces;
using LogPeople.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LogPeople.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly LogPeopleContext _context;
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuariosController(LogPeopleContext context, IUsuarioRepository contexto)
        {
            _context = context;
            _usuarioRepository = contexto;
        }

        /// <summary>
        /// Lista todos os usuários
        /// </summary>
        /// <returns>Uma lista de usuários</returns>
        // GET: api/Usuarios
        [Authorize(Roles = "2,3")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        /// <summary>
        /// Lista um usuário específico
        /// </summary>
        /// <param name="id">id do usuário</param>
        /// <returns>um único usuário</returns>
        // GET: api/Usuarios/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        /// <summary>
        /// Atualiza um usuário
        /// </summary>
        /// <param name="usuario">objeto que recebe os dados atualizados</param>
        /// <param name="arquivo">foto de perfil</param>
        /// <returns>retorna o status No content</returns>
        // PATCH: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPatch]
        public IActionResult PutUsuario([FromForm] Usuario usuario, IFormFile arquivo)
        {
            var usuarioBuscado = _usuarioRepository.BuscarPorId(usuario.IdUsuario);
            string[] extensoesPermitidas = { "jpg", "png", "jpeg" };
            string uploadResultado = Upload.UploadFile(arquivo, extensoesPermitidas);

            if( usuarioBuscado == null)
            {
                return NotFound();
            }

            usuario.Foto = uploadResultado;

            _usuarioRepository.Atualizar(usuario);

            return NoContent();
        }

        /// <summary>
        /// Cadastra um novo usuário
        /// </summary>
        /// <param name="usuario">objeto que leva os dados do usuário a ser cadastrado</param>
        /// <param name="arquivo">foto do usuario</param>
        /// <returns>retorna o status Ok</returns>
        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "2,3")]
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario([FromForm] Usuario usuario, IFormFile arquivo)
        {
            string[] extensoesPermitidas = { "jpg", "png", "jpeg" };
            string uploadResultado = Upload.UploadFile(arquivo, extensoesPermitidas);

            usuario.Foto = uploadResultado;

            // Criptografamos a entrada de novas senhas
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuario", new { id = usuario.IdUsuario }, usuario);
        }

        /// <summary>
        /// Deleta um usuário
        /// </summary>
        /// <param name="id">id do usuário a ser deletado</param>
        /// <returns>retorna o status no content</returns>
        // DELETE: api/Usuarios/5
        [Authorize(Roles = "3")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            Upload.RemoverArquivo(usuario.Foto);

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
